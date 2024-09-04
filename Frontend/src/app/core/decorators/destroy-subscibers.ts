import { Subscriber } from 'rxjs';

// creating the decorator DestroySubscribers
export function DestroySubscribers() {
    return function(target: any) {
        // decorating the function ngOnDestroy
        target.prototype.ngOnDestroy = ngOnDestroyDecorator(target.prototype.ngOnDestroy);
        // decorator function
        function ngOnDestroyDecorator(f: { apply: (arg0: any, arg1: IArguments) => any }) {
            return function(this: any) {
                // saving the result of ngOnDestroy performance to the variable superData
                const superData = f ? f.apply(this, arguments) : null;
                // unsubscribing
                for (const subscriberKey in this.subscribers) {
                    const subscriber = this.subscribers[subscriberKey];
                    if (subscriber instanceof Subscriber) {
                        // console.log("Destroyed");
                        // console.log(subscriber);
                        subscriber.unsubscribe();
                    }
                }
                // returning the result of ngOnDestroy performance
                return superData;
            };
        }
        // returning the decorated class
        return target;
    };
}
