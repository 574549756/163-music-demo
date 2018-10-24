{
    let view = {}
    let model = {
        data:{
            songs:[]
        }
    }
    let controller = {
        init(){
            this.view = view
            this.model = model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('getSongs',songs=>{
                this.model.data.songs = songs
                console.log(this.model.data)
            })
        }
    }
    controller.init(view,model)
}