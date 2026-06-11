const path = require("path");
const multer = require("multer");
const { validation } = require("../middleware/authValidationMiddleware");
const { getModel } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { IngestionPipeline, Parser } = require("../services/rag");
const db = require("../db");
const { createLogger } = require("../lib/logger");

const log = createLogger("documents");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    if (Parser.isSupported(file.mimetype, file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype} (${file.originalname})`));
    }
  },
});

module.exports = (router) => {
  /**
   * @swagger
   * /documents/upload:
   *   post:
   *     summary: Upload a document for RAG ingestion
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *               title:
   *                 type: string
   *     responses:
   *       200:
   *         description: Document uploaded and ingestion started
   */
  router.post(
    "/documents/upload",
    validation,
    upload.single("file"),
    async (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file provided" });
        }

        const doc = await insertModel("document", {
          user_id: req.user.id,
          title: req.body.title || req.file.originalname,
          filename: req.file.originalname,
          file_path: req.file.path,
          mime_type: req.file.mimetype,
          size_bytes: req.file.size,
          status: "pending",
        });

        // Fire-and-forget ingestion
        const pipeline = new IngestionPipeline();
        pipeline.ingest(doc).catch((err) => {
          log.error({ err, documentId: doc.id }, "Background ingestion failed");
        });

        res.json({
          code: 200,
          data: { id: doc.id, status: "pending", filename: req.file.originalname },
          message: "Document uploaded, ingestion started",
        });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @swagger
   * /documents:
   *   get:
   *     summary: List all documents for the current user
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   */
  router.get("/documents", validation, async (req, res, next) => {
    try {
      const docs = await getModel("document", {
        filters: { user_id: req.user.id },
        select: "id, title, filename, mime_type, size_bytes, status, chunk_count, error_message, created_at",
      });
      res.json({ code: 200, data: docs });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /documents/:id:
   *   get:
   *     summary: Get document details including chunk count
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   */
  router.get("/documents/:id", validation, async (req, res, next) => {
    try {
      const docs = await getModel("document", {
        filters: { id: req.params.id, user_id: req.user.id },
      });

      if (!docs.length) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json({ code: 200, data: docs[0] });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /documents/:id:
   *   delete:
   *     summary: Delete a document and its chunks
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   */
  router.delete("/documents/:id", validation, async (req, res, next) => {
    try {
      const docs = await getModel("document", {
        filters: { id: req.params.id, user_id: req.user.id },
      });

      if (!docs.length) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Chunks cascade-delete via FK
      await db.query("DELETE FROM document WHERE id = ? AND user_id = ?", [
        req.params.id,
        req.user.id,
      ]);

      res.json({ code: 200, message: "Document deleted" });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /documents/:id/reingest:
   *   post:
   *     summary: Re-run ingestion on a failed document
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   */
  router.post("/documents/:id/reingest", validation, async (req, res, next) => {
    try {
      const docs = await getModel("document", {
        filters: { id: req.params.id, user_id: req.user.id },
      });

      if (!docs.length) {
        return res.status(404).json({ error: "Document not found" });
      }

      const doc = docs[0];

      // Clear old chunks before re-ingestion
      await db.query("DELETE FROM document_chunk WHERE document_id = ?", [doc.id]);

      const pipeline = new IngestionPipeline();
      pipeline.ingest(doc).catch((err) => {
        log.error({ err, documentId: doc.id }, "Re-ingestion failed");
      });

      res.json({ code: 200, message: "Re-ingestion started" });
    } catch (error) {
      next(error);
    }
  });
};
