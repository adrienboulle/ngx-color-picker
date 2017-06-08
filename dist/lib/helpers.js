import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core';
var TextDirective = (function () {
    function TextDirective() {
        this.newValue = new EventEmitter();
    }
    TextDirective.prototype.changeInput = function (value) {
        if (this.rg === undefined) {
            this.newValue.emit(value);
        }
        else {
            var numeric = parseFloat(value);
            if (!isNaN(numeric) && numeric >= 0 && numeric <= this.rg) {
                this.newValue.emit({ v: numeric, rg: this.rg });
            }
        }
    };
    return TextDirective;
}());
export { TextDirective };
TextDirective.decorators = [
    { type: Directive, args: [{
                selector: '[text]',
                host: {
                    '(input)': 'changeInput($event.target.value)'
                }
            },] },
];
/** @nocollapse */
TextDirective.ctorParameters = function () { return []; };
TextDirective.propDecorators = {
    'newValue': [{ type: Output, args: ['newValue',] },],
    'text': [{ type: Input, args: ['text',] },],
    'rg': [{ type: Input, args: ['rg',] },],
};
var SliderDirective = (function () {
    function SliderDirective(el) {
        var _this = this;
        this.el = el;
        this.newValue = new EventEmitter();
        this.listenerMove = function (event) { _this.move(event); };
        this.listenerStop = function () { _this.stop(); };
    }
    SliderDirective.prototype.setCursor = function (event) {
        var height = this.el.nativeElement.offsetHeight;
        var width = this.el.nativeElement.offsetWidth;
        var x = Math.max(0, Math.min(this.getX(event), width));
        var y = Math.max(0, Math.min(this.getY(event), height));
        if (this.rgX !== undefined && this.rgY !== undefined) {
            this.newValue.emit({ s: x / width, v: (1 - y / height), rgX: this.rgX, rgY: this.rgY });
        }
        else if (this.rgX === undefined && this.rgY !== undefined) {
            this.newValue.emit({ v: y / height, rg: this.rgY });
        }
        else {
            this.newValue.emit({ v: x / width, rg: this.rgX });
        }
    };
    SliderDirective.prototype.move = function (event) {
        event.preventDefault();
        this.setCursor(event);
    };
    SliderDirective.prototype.start = function (event) {
        this.setCursor(event);
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
    };
    SliderDirective.prototype.stop = function () {
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
    };
    SliderDirective.prototype.getX = function (event) {
        return (event.pageX !== undefined ? event.pageX : event.touches[0].pageX) - this.el.nativeElement.getBoundingClientRect().left - window.pageXOffset;
    };
    SliderDirective.prototype.getY = function (event) {
        return (event.pageY !== undefined ? event.pageY : event.touches[0].pageY) - this.el.nativeElement.getBoundingClientRect().top - window.pageYOffset;
    };
    return SliderDirective;
}());
export { SliderDirective };
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
SliderDirective.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
SliderDirective.propDecorators = {
    'newValue': [{ type: Output, args: ['newValue',] },],
    'slider': [{ type: Input, args: ['slider',] },],
    'rgX': [{ type: Input, args: ['rgX',] },],
    'rgY': [{ type: Input, args: ['rgY',] },],
};
var SliderPosition = (function () {
    function SliderPosition(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
    return SliderPosition;
}());
export { SliderPosition };
var SliderDimension = (function () {
    function SliderDimension(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
    return SliderDimension;
}());
export { SliderDimension };
//# sourceMappingURL=helpers.js.map