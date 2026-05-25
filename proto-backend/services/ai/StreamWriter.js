class StreamWriter {
  constructor(res) {
    this.res = res;
  }

  _send(event) {
    if (!this.res || this.res.writableEnded) return;
    this.res.write(JSON.stringify(event) + "\n");
  }

  status(stage, extra = {}) {
    this._send({ type: "status", stage, ...extra });
  }

  token(value) {
    if (typeof value !== "string" || value.length === 0) return;
    this._send({ type: "token", value });
  }

  done(extra = {}) {
    this._send({ type: "done", ...extra });
  }

  error(message) {
    this._send({ type: "error", message: message || "Stream error" });
  }
}

module.exports = StreamWriter;
