{
    let view = {
        el: 'songBelongsList-displayArea',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ol class="playList-music">
            <ul v-for="playlist in playlists">
            </ul>
        </ol>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let { playlists, selectedPlaylistId } = data
            let liList = playLists.map(playlist => {
                let $li = $('<ul></ul>').html(``)
            })
        }
    }
    let model = {
        data: {
            playLists: [],
            selectedPlaylistId: undefined
        },
        find(playlistId) {
            let playlist = AV.Object.createWithoutData('Course', playlistId)
            let query = new AV.Query('playlistMap')
            query.equalTo('course', playlist)
            query.find().then(playlistMap => {
                playlistMap.forEach(function(scm, i, a) {
                    let songs = scm.get(song)
                    console.log(songs)
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvent()
        },
        getAllPlaylistsInnerSong() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvent() {
            window.eventHub.on('addSong', playlistId => {
                var playlist = AV.Object.createWithoutData('Course', playlistId)
                var query = new AV.Query('playlistMap')
                query.equalTo('course', playlist)
                query.find().then(function(playlistMap) {
                    playlistMap.forEach(function(scm, i, a) {
                        var songs = scm.get('song')
                    })
                })
            })
            window.eventHub.on('renderPlaylist', selectedPlaylistId => {
                this.getAllPlaylistsInnerSong(selectedPlaylistId)
            })
        }
    }
    controller.init(view, model)
}
