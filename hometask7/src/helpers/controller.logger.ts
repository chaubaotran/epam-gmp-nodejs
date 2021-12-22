import { logger } from "../shared/logger";

export const ControllerLogger = () => {
  return function decorator(
    target: any,
    name: string,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value;

    if (typeof originalMethod === "function") {
      descriptor.value = async (...args: any) => {
        try {
          const timeStart = Date.now();
          await originalMethod.apply(this, args);
          const timeStop = Date.now();
          const executionTime = timeStop - timeStart;
          logger.info(
            `Method ${name} took ${executionTime.toFixed(2)}ms to execute`
          );
        } catch (error) {
          logger.error(`Failed at method ${name}: ${error.message}`);
          const [, , next] = args;
          next(error);
        }
      };
    }
  };
};
