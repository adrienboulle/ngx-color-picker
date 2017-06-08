import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core';
export class TextDirective {
    constructor() {
        this.newValue = new EventEmitter();
    }
    changeInput(value) {
        if (this.rg === undefined) {
            this.newValue.emit(value);
        }
        else {
            let numeric = parseFloat(value);
            if (!isNaN(numeric) && numeric >= 0 && numeric <= this.rg) {
                this.newValue.emit({ v: numeric, rg: this.rg });
            }
        }
    }
}
TextDirective.decorators = [
    { type: Directive, args: [{
                selector: '[text]',
                host: {
                    '(input)': 'changeInput($event.target.value)'
                }
            },] },
];
/** @nocollapse */
TextDirective.ctorParameters = () => [];
TextDirective.propDecorators = {
    'newValue': [{ type: Output, args: ['newValue',] },],
    'text': [{ type: Input, args: ['text',] },],
    'rg': [{ type: Input, args: ['rg',] },],
};
export class SliderDirective {
    constructor(el) {
        this.el = el;
        this.newValue = new EventEmitter();
        this.listenerMove = (event) => { this.move(event); };
        this.listenerStop = () => { this.stop(); };
    }
    setCursor(event) {
        let height = this.el.nativeElement.offsetHeight;
        let width = this.el.nativeElement.offsetWidth;
        let x = Math.max(0, Math.min(this.getX(event), width));
        let y = Math.max(0, Math.min(this.getY(event), height));
        if (this.rgX !== undefined && this.rgY !== undefined) {
            this.newValue.emit({ s: x / width, v: (1 - y / height), rgX: this.rgX, rgY: this.rgY });
        }
        else if (this.rgX === undefined && this.rgY !== undefined) {
            this.newValue.emit({ v: y / height, rg: this.rgY });
        }
        else {
            this.newValue.emit({ v: x / width, rg: this.rgX });
        }
    }
    move(event) {
        event.preventDefault();
        this.setCursor(event);
    }
    start(event) {
        this.setCursor(event);
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
    }
    stop() {
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
    }
    getX(event) {
        return (event.pageX !== undefined ? event.pageX : event.touches[0].pageX) - this.el.nativeElement.getBoundingClientRect().left - window.pageXOffset;
    }
    getY(event) {
        return (event.pageY !== undefined ? event.pageY : event.touches[0].pageY) - this.el.nativeElement.getBoundingClientRect().top - window.pageYOffset;
    }
}
SliderDirective.decorators = [
    { type: Directive, args: [{
                selector: '[slider]',
                host: {
                    '(mousedown)': 'start($event)',
                    '(touchstart)': 'start($event)'
                }
            },] },
];
/** @nocollapse */
SliderDirective.ctorParameters = () => [
    { type: ElementRef, },
];
SliderDirective.propDecorators = {
    'newValue': [{ type: Output, args: ['newValue',] },],
    'slider': [{ type: Input, args: ['slider',] },],
    'rgX': [{ type: Input, args: ['rgX',] },],
    'rgY': [{ type: Input, args: ['rgY',] },],
};
export class SliderPosition {
    constructor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}
export class SliderDimension {
    constructor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}
//# sourceMappingURL=helpers.js.map