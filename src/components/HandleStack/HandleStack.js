import {
  clearStack,
  pushComponent,
  pushOnToDraggableComponent,
} from "../../Features/StackSlice";
import { _componentMap } from "./ComponentMap"; // Adjust path as needed

// class ComponentStack {
//   constructor(dispatch) {
//     this.dispatch = dispatch;
//     this.type = ["post"];
//   }

//   handleStackClear() {
//     this.dispatch(clearStack());
//   }

//   handleStack(component_name, props = {}) {
//     this.handleMountComponent(component_name, props);
//   }

//   handleMountComponent(name, props = {}) {
//     const ComponentFunc = _componentMap[name];

//     if (!ComponentFunc) {
//       console.error(`Component "${name}" not found in componentMap`);
//       return;
//     }

//     const componentInstance = ComponentFunc(props);

//     if (this.type.includes(name)) {
//       this.dispatch(
//         pushOnToDraggableComponent({
//           id: name,
//         })
//       );
//     } else {
//       this.dispatch(
//         pushComponent({
//           id: name,
//           component: componentInstance,
//         })
//       );
//     }
//   }
// }

// export default ComponentStack;

class ComponentStack {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  handleStackClear() {
    this.dispatch(clearStack());
  }

  handleStack(component_name, props = {}) {
    console.log("component_name", component_name);
    this.handleMountComponent(component_name, props);
  }

  handleMountComponent(name, props = {}) {
    this.dispatch(
      pushComponent({
        id: name,
        props: props,
      })
    );
  }
}

export default ComponentStack;
