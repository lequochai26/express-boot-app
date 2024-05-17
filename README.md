# Express Boot Framework
## Introduction
Express Boot Framework is a back-end **TypeScript** framework build on top of Express.js framework and add many additional features to help make easier, faster and more efficient Express.js App building.

## Why Express Boot ?
- **Faster and easier setup**: Express Boot Framework provides a set of default configurations *(cookie parser, json parser, multer, cors, ...)* so that you don't have to manuall provide it except you need to configure something the way you want. You can start your app with just a line of code.
- **Dependency management**: With Express Boot, you don't have to manage dependencies between classes and objects because this will be handled automatically by Express Boot's Context. All you need to do is `declare` and `inject`.
- **Managability**: With Express Boot, your project will be more Managability, this is because of Express Boot is a method-based framework, that means all you need to do is just define methods in class in a `.ts` file and Express Boot Framework will handle the rest automatically.
- **Modularization**: Because dependencies between objects and classes will be handled by Express Boot, so you can have many files as you want and follow any structure you want as long as your `.ts` files placed in your source root.
- **Easier components testing**: With Express Boot, you can have scripts in your app. (Scripts are methods which will be executed by Express Boot before the launch of your Express app, these usally use for testing your app's components)
- **Session management**: In Express Boot, there's a `SessionFactory`, which will help you manage your clients sessions.

## Key components
- **Node**: Is any object act as a component that compose your app *(only one per type is enough)* which will be the Express Boot Context inject into any method you want, you can call that specific method to get it.
- **Context *(Core)***: A dependency manager or a configurations container or request handlers container. This object will automatically read your `.ts` files source root directory to looking for the informations of **nodes, configurations, request handlers, request middlewares** base on the `decorators` you marked on your classes and methods.
- **App *(Core)***: Represent your Express Boot app that act as a wrapper of `Express.js app` and informations from `Context`. This component will use the informations from `Context` to configures, provides missings by the defaults as well and run `Express.js app`.
- **Session Factory**: Session manager which provides sessions management feature.
- **Request Dispatcher**: Provides request dispatching from one end-point to another end-point feature to your app.

