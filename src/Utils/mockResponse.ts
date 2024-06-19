// for testing purposes, this function will delay the execution of the next line of code

export const mockDelay = async (delay: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
      console.log("mockDelay");
    }, delay);
  });
};

export const throwMockError = async (delay: number) => {
  return new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(new Error("This is a mock error"));
    }, delay);
  });
};

export const mockFunctionError = async (
  func: () => void,
  errorRate: number = 0
) => {
  let errorSanatized = 0;
  if (errorRate > 100) {
    errorSanatized = 100;
  }
  const shouldError = Math.random() * 100 > errorSanatized;

  if (shouldError) {
    return func();
  } else {
    return await throwMockError(1500);
  }
};
