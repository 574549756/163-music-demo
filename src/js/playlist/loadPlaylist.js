{
    let view = {
        el: ''
    }
    let model = {
        data: {
            playlist: []
        }
    }
    let controller = {
        init() {
            this.view = view
            this.model = model
        }
    }
    controller.init(view, model)
}