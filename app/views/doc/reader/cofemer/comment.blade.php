<div class="comment-field" ng-show="user.id">
  <form name="add-comment-form" ng-submit="commentSubmit()">
    <div class="form-group">
      <label for="doc-comment-field">@{{ layoutTexts.commentLabel }}</label>
      <input ng-model="comment.text" id="doc-comment-field" type="text" class="form-control centered" placeholder="@{{ layoutTexts.commentPlaceholder }}" required />
    </div>
    <div class="row">
      <div class="col-xs-8 col-sm-9 col-lg-10">
        <div class="checkbox">
          <label>
            <input ng-model="comment.private" id="doc-private-comment-field" type="checkbox" name="private"> @{{ layoutTexts.privateComment }}
          </label>
        </div>
      </div>
      <div class="col-xs-4 col-sm-3 col-lg-2">
        <button type="submit" class="btn btn-default btn-block">@{{ layoutTexts.sendComment }}</button>
      </div>
    </div>
    <hr>
  </form>
</div>
