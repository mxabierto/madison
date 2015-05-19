<div class="comment-field" ng-show="user.id">
  <form name="add-comment-form" ng-submit="commentSubmit()">
    <div class="form-group">
      <label for="doc-comment-field">Agrega un comentario:</label>
      <input ng-model="comment.text" id="doc-comment-field" type="text" class="form-control centered" placeholder="{{ trans('messages.addacomment') }}" required />
    </div>
    <div class="row">
      <div class="col-xs-8 col-sm-9 col-lg-10">
        <div class="checkbox">
          <label>
            <input ng-model="comment.private" type="checkbox" name="private"> {{ trans('messages.privatecomment') }}
          </label>
        </div>
      </div>
      <div class="col-xs-4 col-sm-3 col-lg-2">
        <button type="submit" class="btn btn-default btn-block">{{ trans('messages.send') }}</button>
      </div>
    </div>
    <hr>
  </form>
</div>
