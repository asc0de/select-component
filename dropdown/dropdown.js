import DropdownMode from "./constants/DropdownMode";

export default class VkDropdown {
    constructor(options = {}) {
        this.mode = options.mode || DropdownMode.SINGLE_SELECT;
        this.element = options.element;
    }
}
