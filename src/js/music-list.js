{
    let view = {
        el: '#musicList-container',
        templete: `
        <ul class="musicList">
                    <li v-for="song in songs">
                    </li>
                </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.templete)
            let { songs } = data
            let liList = songs.map(song => {
                let li = $('<li></li>').text(song.name)
                return li
            })
            $el.find('ul').empty()
            liList.map(domLi => {
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el)
                .find('.active')
                .removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song')
            return query.find().then(songs => {
                this.data.songs = songs.map(song => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', songData => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            console.log('执行到这里了')
            this.model.find().then(() => {
                console.log('----------')
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
            console.log('那条执行完了')
        }
    }
    controller.init(view, model)
}
