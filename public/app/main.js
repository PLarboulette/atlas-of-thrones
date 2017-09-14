import './main.scss'
import template from './main.html'

/** Main UI Controller Class */
class ViewController {
    /** Initialize Application */
    constructor () {
        document.getElementById('app').outerHTML = template
    }
}

window.ctrl = new ViewController();