<div class="comment-field" ng-show="user.id">
<<<<<<< HEAD
    <form name="add-comment-form" ng-submit="commentSubmit(comment)">
        <input ng-model="comment.text" id="doc-comment-field" type="text" class="form-control centered" placeholder="{{ trans('messages.addacomment') }}" required />
        {{-- <button class="btn btn-primary">Add Comment</button> --}}
    </form>    
=======
  <form name="add-comment-form" ng-submit="commentSubmit()">
    <div class="form-group">
      <label for="doc-comment-field">Agrega un comentario:</label>
      <input ng-model="comment.text" id="doc-comment-field" type="text" class="form-control centered" placeholder="{{ trans('messages.addacomment') }}" required />
    </div>
    <hr>
  </form>    
>>>>>>> 1a2c20a03b4dda23c9cfd6d344cfca1115567b1c
</div>