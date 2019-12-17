import 'reflect-metadata';

export default function Throttle(delay: number) {
    return (_: any, __: any, propertyDesciptor: PropertyDescriptor) => {

        propertyDesciptor.value = throttle(propertyDesciptor.value, delay);

        return propertyDesciptor;
    };
}

export function throttle(func: (args: IArguments) => any, ms: number) {

  let isThrottled = false;
  let savedArgs: any = null;
  let savedThis: any = null;

  function wrapper(this: any) {

    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, [arguments]);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
