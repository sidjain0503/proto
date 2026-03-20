const fs = require("fs");
const path = require("path");

class Parser {
  static SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/markdown": "md",
    "text/csv": "csv",
  };

  static isSupported(mimeType) {
    return mimeType in Parser.SUPPORTED_TYPES;
  }

  async parse(filePath, mimeType) {
    const type = Parser.SUPPORTED_TYPES[mimeType];
    if (!type) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    switch (type) {
      case "pdf":
        return this.parsePDF(filePath);
      case "txt":
      case "md":
      case "csv":
        return this.parseText(filePath);
      default:
        throw new Error(`No parser for type: ${type}`);
    }
  }

  async parsePDF(filePath) {
    const pdfParse = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    return {
      text: data.text,
      metadata: {
        pages: data.numpages,
        info: data.info,
      },
    };
  }

  async parseText(filePath) {
    const text = fs.readFileSync(filePath, "utf-8");
    return {
      text,
      metadata: {
        extension: path.extname(filePath),
      },
    };
  }
}

module.exports = Parser;
