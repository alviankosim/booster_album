var surahs = [];
// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";

    $('#deleteBtn').data('id', element.getAttribute('data-id'));
    $('#editBtn').data('id', element.getAttribute('data-id'));

    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;

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

function fetchAlbum() {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3501/album/api',
        dataType: "json",
    }).then(res => {
        if (res?.status) {
            renderAlbum(res?.data || []);
        }
    }).fail(err => {
        console.error('Failed to get album data');
    });
}

function fetchSurah() {
    $.ajax({
        method: "GET",
        url: 'http://localhost:3501/quran/api',
        dataType: "json",
    }).then(res => {
        if (res?.status) {
            surahs = res?.data;
            $('select[name="surah"]').select2("data", surahs.map(item => ({id: item._id, title: item.name})));
        }
    }).fail(err => {
        console.error('Failed to get album data');
    });
}

function handleValidateFormData(data) {
    let daReturn = true;

    if (!data?.caption) {
        daReturn = false;
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

        if (!handleValidateFormData(data)) {
            Swal.fire(
                'Attention!',
                'Please fill valid information to the form!',
                'error'
            );
            return;
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

function handleChangeAlbumType(){
    let elementName = 'select[name="image"]';
    let elementNameEdit = 'select[name="edit_image"]';
    $(elementName).change(function(){
        changeAlbumTypeAction(elementName);
    });
    
    $(elementNameEdit).change(function(){
        changeAlbumTypeAction(elementNameEdit);
    });
}

$(document).ready(function () {
    // init plugin
    initSelect2();

    fetchAlbum();
    fetchSurah();
    changeAlbumTypeAction()

    // listener
    handleSubmit();
    handleEditSubmit();
    handleEdit();
    handleDelete();
    handleChangeAlbumType();
});