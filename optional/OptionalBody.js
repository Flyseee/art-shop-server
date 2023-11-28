export default class OptionalBody {
    present;
    fields;
    element;
  
    constructor(obj, fields) {
      this.fields = fields;
      this.present = true;
      for (let field of this.fields) {
        if (!obj[field]) this.present = false;
      }
  
      this.element = this.present ? obj : null;
    }
    isPresent() {
      return this.present;
    }
    get() {
      this.element;
    }
  }
  