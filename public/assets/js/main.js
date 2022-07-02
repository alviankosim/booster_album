var albums = [];
var surahs = [];
var ayahs = [];

// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

function handleSearchAlbum()
{
    let search = prompt("Find the desired keyword", "Sabar");
    if (search != null) {
        $('#searchWrapper').show(150);
        $('#searchCapt').html(search);
        fetchAlbum(search);
    }
}

function handleResetSearch(){
    $('#searchWrapper').hide();
    fetchAlbum();
}

// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";

    $('#deleteBtn').data('id', element.getAttribute('data-id'));
    $('#editBtn').data('id', element.getAttribute('data-id'));

    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;

    // filter to get current selected
    let daid = element.getAttribute('data-id');
    let found = albums.filter((item) => (item._id == daid))[0];
    if (found?.image == 'verse.jpg') {
        fetchAudioAyah(found?.ayah);
        return;
    }

    let utterThis = new SpeechSynthesisUtterance(element.alt);
    utterThis.lang = 'id-ID';
    utterThis.rate = 1;
    utterThis.pitch = 0.5;

    window.speechSynthesis.speak(utterThis);
}
function hideAlbumModal() {
    $('#modal01').hide(250);
    $('#editAlbum').hide();//show
    window.speechSynthesis.cancel();
}

// Modal 
function onClickAddNew(element) {
    //   document.getElementById("img01").src = element.src;
    document.getElementById("modal02").style.display = "block";
    //   var captionText = document.getElementById("caption");
    //   captionText.innerHTML = element.alt;
}

function hideAddModal() {
    document.getElementById("modal02").style.display = "none";
}

function getPhotoGridTemplate(data) {
    return `
    <div class="w3-third" style="border:1px solid rgba(0,0,0,0.15);border-radius:10px">
        <img src="/images/${data.image}" data-id="${data._id}" style="width:100%" onclick="onClick(this)"
            alt="${data.caption}">
    </div>
    `;
}

function renderAlbum(albums) {
    let daHTML = ``;
    albums.forEach(singlePhoto => {
        daHTML += getPhotoGridTemplate(singlePhoto);
    });

    if (!daHTML) {
        daHTML = `<h5 style="text-align:center">No albums found, try to click <b>"Add New Album"</b> button on the left menu</h5>`;
    }

    $('#photoGrid').html(daHTML);
}

function fetchAudioAyah(ayah)
{
    if(ayah){
        // fetching from API
        var settings = {
            "url": "http://api.alquran.cloud/v1/ayah/"+ayah+"/ar.alafasy",
            "method": "GET",
            "timeout": 0,
          };
          
        $.ajax(settings).done(function (response) {
            if (response?.status == "OK") {
                let audioda = response?.data?.audio;
                $('#quranAudio').attr('src', audioda);

                const audio = document.querySelector("audio");
                audio.volume = 0.8;
                audio.play();
            }
        });
    }
}

function fetchAlbum(search = '') {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3501/album/api?search=' + search,
        dataType: "json",
    }).then(res => {
        if (res?.status) {
            albums = res?.data || [];
            renderAlbum(res?.data || []);
        }
    }).fail(err => {
        console.error('Failed to get album data');
    });
}

function handleChangeSurah(){
    $(document.body).on('change', 'select[name="surah"]', function(){
        let currSelected = $(this).val();
        if (currSelected) {
            fetchAyat(currSelected);
        }
    })
    $(document.body).on('change', 'select[name="surahEdit"]', function(){
        let currSelected = $(this).val();
        if (currSelected) {
            fetchAyat(currSelected, true);
        }
    })
}

function fetchSurah() {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3501/quran/api',
        dataType: "json",
    }).then(res => {
        if (res?.status) {
            surahs = res?.data;
            surahs.map(item => {
                let data = {id: item._id, text: item.name};
                var newOption = new Option(data.text, data.id, false, false);
                $('select[name="surahEdit"]').append(newOption).trigger('change');
            })
            surahs.map(item => {
                let data = {id: item._id, text: item.name};
                var newOption = new Option(data.text, data.id, false, false);
                $('select[name="surah"]').append(newOption).trigger('change');
            })
            // $('select[name="surah"]').select2("data", );
        }
    }).fail(err => {
        console.error('Failed to get album data');
    });
}

function fetchAyat(daid, isEdit = false) {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3501/quran/api/' + daid,
        dataType: "json",
    }).then(res => {
        if (res?.status) {
            ayahs = res?.data;
            // console.log({ayahs})
            let daElementName = 'select[name="ayah"]';
            if (isEdit) {
                daElementName = 'select[name="ayahEdit"]';
            }
            $(daElementName).html('').select2({data: ayahs.map(item => {
                let data = {id: item.number, text: 'Ayah '+ item.numberInSurah +' - ' + item.text};
                return data;
            })});
            // $('select[name="surah"]').select2("data", );
        }
    }).fail(err => {
        console.error('Failed to get album data');
    });
}

function handleValidateFormData(data, isEdit = false) {
    let daReturn = true;

    if (!data?.caption) {
        daReturn = false;
    }

    if (data?.image == "verse.jpg") {
        let selectedSurah = $(isEdit ? 'select[name="surahEdit"]' : 'select[name="surah"]').val();
        let selectedAyah = $(isEdit ? 'select[name="ayahEdit"]' : 'select[name="ayah"]').val();

        if (!selectedSurah || !selectedAyah) {
            daReturn = false;
        }
    }

    return daReturn;
}

function handleSubmit() {
    $('#addNewBtn').click(function () {
        let data = {
            caption: $('input[name="caption"]').val(),
            image: $('select[name="image"]').val()
        };

        if (!handleValidateFormData(data)) {
            Swal.fire(
                'Attention!',
                'Please fill valid information to the form!',
                'error'
            );
            return;
        }

        if (data?.image == 'verse.jpg') {
            let selectedSurah = $('select[name="surah"]').val();
            let selectedAyah = $('select[name="ayah"]').val();

            data.surah = selectedSurah;
            data.ayah = selectedAyah;
        }

        // ajax request
        $.ajax({
            method: "POST",
            url: 'http://localhost:3501/album/api',
            dataType: "json",
            data: data
        }).then(res => {
            if (res?.status) {
                Swal.fire(
                    'Good job!',
                    'Successfully add new album data!',
                    'success'
                );
                // close modal
                $('#modal02').hide(250);
                fetchAlbum();// refetch

                // reset form
                $('input[name="caption"]').val('')
                $('select[name="image"]').click(function () {
                    $('option:selected', this).removeAttr('selected');
                });
            }
        }).fail(err => {
            console.error('Failed to add album data');
            Swal.fire(
                'Attention!',
                'Failed to add new album data',
                'error'
            );
        });
    });
}

function handleDelete() {
    $('#deleteBtn').click(function () {

        let daID = $(this).data('id');
        let deleteAction = () => {
            // ajax request
            $.ajax({
                type: "DELETE",
                url: 'http://localhost:3501/album/api/' + daID,
                dataType: "json",
                data: {}
            }).then(res => {
                if (res?.status) {
                    Swal.fire(
                        'Good job!',
                        'Successfully delete album data!',
                        'success'
                    );
                    // close modal
                    $('#modal01').hide(250);
                    fetchAlbum();// refetch
                }
            }).fail(err => {
                console.error('Failed to delete album data');
                Swal.fire(
                    'Attention!',
                    'Failed to delete album data',
                    'error'
                );
            });
        }

        Swal.fire({
            title: 'Do you want to delete this album?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                deleteAction();
            }
        })
    });
}

function handleEdit() {
    $('#editBtn').click(function () {

        let daID = $(this).data('id');
        $('#editSubmitBtn').data('id', daID)// set the submit button id

        $('#editAlbum').show(250, function () {
            $("div").scrollTop(1000);// scroll to show the form
        });//show
    });
}

function handleEditSubmit() {
    $('#editSubmitBtn').click(function () {

        let daID = $(this).data('id');
        let data = {
            caption: $('input[name="edit_caption"]').val(),
            image: $('select[name="edit_image"]').val()
        };

        if (!handleValidateFormData(data, true)) {
            Swal.fire(
                'Attention!',
                'Please fill valid information to the form!',
                'error'
            );
            return;
        }

        if (data?.image == 'verse.jpg') {
            let selectedSurah = $('select[name="surahEdit"]').val();
            let selectedAyah = $('select[name="ayahEdit"]').val();

            data.surah = selectedSurah;
            data.ayah = selectedAyah;
        }

        // ajax request
        $.ajax({
            type: "PUT",
            url: 'http://localhost:3501/album/api/' + daID,
            dataType: "json",
            data: data
        }).then(res => {
            if (res?.status) {
                Swal.fire(
                    'Good job!',
                    'Successfully edit album data!',
                    'success'
                );
                // close modal
                $('#modal01').hide(250);
                $('#editAlbum').hide();
                fetchAlbum();// refetch

                // reset form
                $('input[name="edit_caption"]').val('')
                $('select[name="edit_image').click(function () {
                    $('option:selected', this).removeAttr('selected');
                });
            }
        }).fail(err => {
            console.error('Failed to edit album data');
            Swal.fire(
                'Attention!',
                'Failed to edit new album data',
                'error'
            );
        });
    });
}

function initSelect2(){
    $('.select2').each(function(){
        let daThis = $(this);
        daThis.select2({
            placeholder: daThis.data('placeholder') || 'Select an option'
        });
    });
}

function changeAlbumTypeAction(elementName = 'select[name="image"]'){
    if ($(elementName).val() == 'verse.jpg') {
        $('#surah').show(250);
    } else {
        $('#surah').hide(250);
    }
}

function changeAlbumTypeEditAction(elementName = 'select[name="image"]'){
    if ($(elementName).val() == 'verse.jpg') {
        $('#surahEdit').show(250);
    } else {
        $('#surahEdit').hide(250);
    }
}

function handleChangeAlbumType(){
    let elementName = 'select[name="image"]';
    let elementNameEdit = 'select[name="edit_image"]';
    $(elementName).change(function(){
        changeAlbumTypeAction(elementName);
    });
    
    $(elementNameEdit).change(function(){
        changeAlbumTypeEditAction(elementNameEdit);
    });
}

$(document).ready(function () {
    // init plugin
    initSelect2();

    fetchAlbum();
    fetchSurah();
    changeAlbumTypeAction()
    changeAlbumTypeEditAction()

    // listener
    handleSubmit();
    handleEditSubmit();
    handleEdit();
    handleDelete();
    handleChangeAlbumType();
    handleChangeSurah();
});