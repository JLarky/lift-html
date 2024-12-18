# lift-html

lift-html is a tiny library for building HTML Web Components, components that
are meant to enhance existing HTML on the page instead of rendering it on the
client or hydrating it. It utilizes SolidJS to make attributes reactive, uses
signals for state management and uses hooks to better manipulate the DOM.

Code for `liftHtml` is public domain, so you are free to skip the dependency and
copy the code into your project. Do that if:

- you don't want to add another npm/jsr dependency
- you want to remove the parts of the code you don't need
- you want to quickly modify the code for your project or even a single
  component


## Why you need web components framework

Web Components are a browser primitive, kind of like `document.createElement`.
You are not expected to use them directly because of the amount of boilerplate
and DX issues. But similarly to `document.createElement`, there are plently of
usecases that require you to get your hands dirty with the native API.

`lift-html` is an attempt to create tiny wrapper around web components that
solves enough of DX issues without introducing a completely new paradigm. If I
would put it in a single sentence, it would be: "When using lift-html I don't
want to feel like I'm writing a component (web or otherwise), I just want to
write HTML, CSS and JS/TS".

To achieve that we had to depart a bit from the web components vibe. Namely:

- we don't use class syntax
- 

classes make your code to be concerned too much about lifecycles, so very
similar to jump from class components in React to functional components. Imagine
a scenario of adding some sort of comuted property, now with classes you start
by adding a property on the class to store a value, adding a getter on the class
to access it, adding a callback method to react and update that value and a call
in constructor to hook that callback to the lifecycle. All of those are going to
be spread over your whole class, mixing together in buckets (class properties,
class methods, getters, setters, public APIs, callbacks, constructor initializers,
connectedCallback initializers, destructors) and your only option to share the
logic is to use Mixins, which have their issues with performance and type safety.
With function syntax I can have `const thing = myThing(this)` and for the most
part not worry about how `myThing` is implemented. This does come with a bit of
theoretically loss of performance and flexibility compared to writing everything
by hand, but that option is always there if you need it.

What do you lose? When you inherit a Dog class your class won't also be an Animal


, you just use a signal and
without classes it works closer to how components work or even jQuery
