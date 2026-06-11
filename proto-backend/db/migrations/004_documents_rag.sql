-- 004: documents and RAG chunks
CREATE TABLE IF NOT EXISTS document (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  mime_type VARCHAR(100) NULL,
  size_bytes INT NULL,
  status ENUM('pending', 'processing', 'ready', 'failed') NOT NULL DEFAULT 'pending',
  chunk_count INT NOT NULL DEFAULT 0,
  error_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_document_user_id (user_id),
  KEY idx_document_status (status),
  CONSTRAINT fk_document_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS document_chunk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  chunk_index INT NOT NULL,
  content MEDIUMTEXT NOT NULL,
  embedding JSON NULL,
  token_count INT NOT NULL DEFAULT 0,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_document_chunk_document_id (document_id),
  CONSTRAINT fk_document_chunk_document FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
