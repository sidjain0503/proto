class ChainRunner {
  async run(chain, ctx) {
    chain.init(ctx);

    const step = chain.nextStep(ctx);
    const result = await step.execute(ctx);

    if (result.type !== "final") {
      throw new Error("Chain ended without final output");
    }
    return {
      output: result.output,
      context: ctx,
    };
  }
}

module.exports = ChainRunner;
