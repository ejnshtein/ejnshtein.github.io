export default class MNotification {
    /**
     * New notification
     * @param {object} options 
     * @param {string} [options.title = null]
     * @param {string} options.body
     * @param {string} [options.type = 'succ]
     * @param {number} [options.time = 7000] Notification delay time
     */
    constructor(options) {
        this.title = options.title || null
        this.body = options.body
        this.type = options.type || 'succ'
        this.time = options.time || typeof options.time == 'number' ? options.time : 7000
    }
    display() {
        let notification = document.querySelector('#notification');
        notification.setAttribute('closeTime', Date.now() + this.time);
        //console.log(this.hidden())
        //console.log('hey',this.time)
        if (this.time != 0)setTimeout(this.hide, this.time);
        //console.log(this.time)
        if (this.hidden()) {
            this.toggle()
            if (this.title) {
                notification.appendChild(getTitle(this.title));
            }
            notification.appendChild(getBody(this.body));
            notification.classList.add(this.type);
            notification.classList.add('pulse')
        } else {
            if (this.title && notification.querySelector('[name=ntitle]')) {
                notification.querySelector('[name=ntitle]').innerHTML = this.title;
            } else if (this.title && !notification.querySelector('[name=ntitle]')) {
                notification.insertBefore(getTitle(this.title), notification.firstChild);
            } else if (!this.title && notification.querySelector('[name=ntitle]')) {
                notification.querySelector('[name=ntitle]').remove();
            }
            notification.querySelector('[name=nbody]').innerHTML = this.body;
            notification.classList.add('pulse')
            if (!notification.classList.contains(this.type)) {
                switch (this.type) {
                    case 'succ':
                        notification.classList.replace('err', 'succ');
                        break
                    case 'err':
                        notification.classList.replace('succ', 'err');
                        break
                }
            }
        }
    }
    toggle() {
        if (this.hidden) {
            this.show();
        } else {
            notHide();
        }
    }
    show() {
        document.querySelector('#notification').classList.add('show');
    }
    hide(click) {
        if (this.hidden || !document.querySelector('#notification').getAttribute('closeTime')) return;
        if (Number.parseInt(document.querySelector('#notification').getAttribute('closeTime')) > Date.now() && !click) return;
        notHide()
    }
    hidden() {
        return !document.querySelector('#notification').classList.contains('show');
    }
}

function notHide() {
    document.querySelector('#notification').classList.remove('show');
    document.querySelector('#notification').removeAttribute('closeTime');
    setTimeout(function () {
        document.querySelector('#notification').innerHTML = '';
        document.querySelector('#notification').classList = '';
    }, 200);
}

function getTitle(data) {
    let title = document.createElement('div');
    title.classList = 'ntitle';
    title.setAttribute('name', 'ntitle');
    title.innerHTML = data;
    return title;
}

function getBody(data) {
    let body = document.createElement('div')
    body.classList = 'nbody';
    body.setAttribute('name', 'nbody');
    body.innerHTML = data;
    body.title = data;
    return body;
}