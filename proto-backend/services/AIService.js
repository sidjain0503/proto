const ExecutionContext = require("./ai/executor/aicontext/ExecutionContext");
const BasicChatChain = require("./ai/executor/chains/BasicChain");
const ChainRunner = require("./ai/executor/chains/ChainRunner");

async function runChat(req, res) {
  try{

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const ctx = new ExecutionContext({
    userId: req.user.id,
    messages: req.body,
    provider: "local",
    providerOpts: {
      model: "gemma4:e2b",
      
    },
  });

  let chain;

  chain = new BasicChatChain({
    stream: true,
    res,
  });

  const runner = new ChainRunner();
  await runner.run(chain, ctx);
}catch(error){
  throw error
}

}

module.exports = { runChat };
