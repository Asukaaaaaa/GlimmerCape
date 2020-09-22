export const dva = {
  config: {
    onError(e: ErrorEvent) {
      e.preventDefault();
      console.error(e.message);
    },
  },
};
