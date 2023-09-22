const checkboxes = $(".todo-check");

$(document).on("click", async () => {
    for(let i=0; i<checkboxes.length; i++){
        if(checkboxes[i].checked){
            $(`#todoItem${i}`).addClass("text-strike");
        } else {
            $(`#todoItem${i}`).removeClass("text-strike");
        }
    }
});