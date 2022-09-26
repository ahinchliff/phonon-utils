export const createInvokeQueue = () => {
  let nextFunctionId = 1;
  let runningFunctionId = 1;

  return function <T>(fn: () => Promise<T>): Promise<T> {
    const functionId = nextFunctionId;
    nextFunctionId++;
    return new Promise<T>((resolve, reject) => {
      const interval = setInterval(async () => {
        if (runningFunctionId !== functionId) {
          return;
        }
        clearInterval(interval);
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          runningFunctionId++;
        }
      }, 0);
    });
  };
};
