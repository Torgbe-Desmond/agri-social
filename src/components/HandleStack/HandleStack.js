import { clearStack, pushComponent } from "../../Features/StackSlice";
import { componentMap } from "./ComponentMap"; // Adjust path as needed

class ComponentStack {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  handleStackClear() {
    this.dispatch(clearStack());
  }

  handleStack(component_name, props = {}) {
    this.handleMountComponent(component_name, props);
  }

  handleMountComponent(name, props = {}) {
    const ComponentFunc = componentMap[name];

    if (!ComponentFunc) {
      console.error(`Component "${name}" not found in componentMap`);
      return;
    }

    const componentInstance = ComponentFunc(props);

    this.dispatch(
      pushComponent({
        id: name,
        component: componentInstance,
      })
    );
  }
}

export default ComponentStack;
