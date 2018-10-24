{
    let view = {}
    let model = {
        data:{
            playlist:[],
            songs:[]
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            let id = this.getPlaylistId()
            this.bindEventHub()
            this.loadPlaylist()
            this.loadMusic()
        },
        bindEventHub(){
        },
        getPlaylistId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }

            let array = search.split('&').filter(v => v)
            let id = ''

            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        },
        loadPlaylist(){
            let script1 = document.createElement('script')
            script1.src = './js/playlist/loadPlaylist.js'
            script1.onload = function(){}
            document.body.appendChild(script1)
        },
        loadMusic(){
            let script2 = document.createElement('script')
            script2.src = './js/playlist/loadMusic.js'
            script2.onload = function(){}
            document.body.appendChild(script2)
        }
    }
    controller.inid(view,model)
}