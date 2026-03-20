class ChainRunner {
  async run(chain, ctx) {
    chain.init(ctx);

    let result;
    do {
      const step = chain.nextStep(ctx);
      if (!step) break;
      result = await step.execute(ctx);
      if (result.type === "final") break;
    } while (!chain.shouldTerminate(ctx));

    if (!result || result.type !== "final") {
      throw new Error("Chain ended without final output");
    }

    return {
      output: result.output,
      context: ctx,
    };
  }
}

module.exports = ChainRunner;
