{
    let view = {
        el: '',
        render(Playlist){
            $('title').text(`${Playlist.name}`)
        }
    }
    let model = {
        data: {
            playlist: []
        },
        getPlaylist(playlists) {
            var query = new AV.Query('Playlist');
            return query.get(playlists).then( (playlist)=> {
                Object.assign(this.data.playlist, {
                    id: playlist.id,
                    ...playlist.attributes
                })
                return playlist
            });
        }
    }
    let controller = {
        init() {
            this.view = view
            this.model = model
            
            this.bindEventHub()
        },
        changeTitle(){
            
        },
        bindEventHub() {
            window.eventHub.on('getPlaylist', playlist => {
                this.model.getPlaylist(playlist).then(()=>{
                    this.view.render(this.model.data.playlist)
                    
                })
            })
        }
    }
    controller.init(view, model)
}