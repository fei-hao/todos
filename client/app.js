/**
 * Created by feiha on 12/3/2016.
 */
$(()=>{
    $.get('http://127.0.0.1:3000/todos',function (data,success) {
        // data = data.data;
        for(index in data){
            var todo = data[index];
            $('#todos').append(`
            <div class="ui centered card">
                <div class="content">
                <i class="cn flag"></i>
                    <div class="description">${todo.text}</div>
                </div>
                <div class="ui animated fade button" tabindex="0">
                  <div class="visible content">Complete</div>
                  <div class="hidden content">Are You Sure?</div>
                </div>
            </div>
            `)
        }
    });
});