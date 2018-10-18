{
    let view = {
        el: '.page-3',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {
        data: [],
        search: name => {
            var query1 = new AV.Query('Song')
            query1.contains('name', name)
            var query2 = new AV.Query('Song')
            query2.contains('artist', name)
            var query = AV.Query.or(query1, query2)
            query.find().then(function(results) {
                $('#searchResult').empty()
                if (results.length === 0) {
                    let noResult = `<div>暂无搜索结果</div>`
                    $('#searchResult').append(noResult)
                } else {
                    for (var i = 0; i < results.length; i++) {
                        let song = results[i]
                        let li = `
                        <li class="addSong2list" data-id="${song.id}">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-search"></use>
                            </svg>
                            <p>${song.attributes.name} - ${
                            song.attributes.artist
                        }
                        </p>
                        </li>`
                        $('#searchResult').append(li)
                    }
                }
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
        bindEvent() {
            window.eventHub.on('selectTab', tabName => {
                if (tabName === 'page-3') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
            let timer = null
            $('#cross').on('click', e => {
                let value = $('input#search').val('')
                $('#searchResult').empty()
                $('#cross').removeClass('active')
            })
            $(document).on('click', '.addSong2list', e => {
                let musicId = e.currentTarget.getAttribute('data-id')
                let playlistId = $('ul.active').attr('data-playlist-id')

                let addsong = new AV.Object.createWithoutData('Song', musicId)

                let playlist = new AV.Object.createWithoutData(
                    'Playlist',
                    playlistId
                )

                // 选课表对象

                let playlistMap = new AV.Object('playlistMap')

                // 设置关联
                playlistMap.set('playlistPointer', playlist)
                playlistMap.set('songPointer', addsong)
                console.log('设置关联完成')
                // 保存选课表对象
                playlistMap.save()
                console.log('保存完成')

                setTimeout(() => {
                    let courseList = new AV.Query('Playlist')
                    let playlistResult = new AV.Object.createWithoutData(
                        'playlist',
                        playlistId
                    )

                    console.log(listResult())
                    var ListResult = listResult.results.map(function(item) {
                        return item.id
                    })
                    console.log(ListResult)
                    var query = new AV.Query('playlistMap')

                    query.equalTo('playlist', playlists)

                    query.find().then(function(PlaylistMap) {
                        console.log(PlaylistMap)
                        playlistMap.forEach(function(scm, i, a) {
                            console.log(scm)
                            var songs = scm.get('song')
                            console.log('查询完成')
                            console.log(songs)
                        })
                    })
                }, 1000)

                /* window.eventHub.emit('addSong', playlistId) */
            })
            $('input#search').on('input', e => {
                if (
                    $(e.currentTarget)
                        .val()
                        .trim()
                ) {
                    $('#cross').addClass('active')
                } else {
                    $('#cross').removeClass('active')
                }
                if (timer) {
                    window.clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    timer = null
                    let $input = $(e.currentTarget)
                    let value = $input.val().trim()
                    if (value === '') {
                        $('#searchResult').empty()
                        return
                    }
                    this.model.search(value)
                }, 400)
            })
        }
    }
    controller.init(view, model)
}
