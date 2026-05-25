const fs = require("fs");
const path = require("path");

class Parser {
  static SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/markdown": "md",
    "text/x-markdown": "md",
    "application/x-markdown": "md",
    "text/csv": "csv",
  };

  static SUPPORTED_EXTENSIONS = {
    ".pdf": "pdf",
    ".txt": "txt",
    ".md": "md",
    ".markdown": "md",
    ".csv": "csv",
  };

  static resolveType(mimeType, filename) {
    if (mimeType && Parser.SUPPORTED_TYPES[mimeType]) {
      return Parser.SUPPORTED_TYPES[mimeType];
    }
    if (filename) {
      const ext = path.extname(filename).toLowerCase();
      if (Parser.SUPPORTED_EXTENSIONS[ext]) {
        return Parser.SUPPORTED_EXTENSIONS[ext];
      }
    }
    return null;
  }

  static isSupported(mimeType, filename) {
    return Parser.resolveType(mimeType, filename) !== null;
  }

  async parse(filePath, mimeType) {
    const type = Parser.resolveType(mimeType, filePath);
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
    const { PDFParse } = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    try {
      const textResult = await parser.getText();
      const infoResult = await parser.getInfo();
      return {
        text: textResult.text,
        metadata: {
          pages: textResult.total,
          info: infoResult.info,
        },
      };
    } finally {
      await parser.destroy();
    }
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
