{
    let view = {
        el: ''
    }
    let model = {
        data: {
            playlist: []
        },
        getPlaylist(playlists) {
            var query = new AV.Query('Playlist');
            query.get(playlists).then(function (playlist) {
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
        bindEventHub() {
            window.eventHub.on('getPlaylist', playlist => {
                this.model.getPlaylist(playlist).then(()=>{
                    this.model.render(this.model.data)
                })
            })
        }
    }
    controller.init(view, model)
}