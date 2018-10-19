const yargs = {
  yargs: () => ({
    alias: () => {},
    usage: (msg, description, builder, handler) => {
      return handler();
    }
  })
};

export default yargs;