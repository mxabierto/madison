<div class="comment-field" ng-show="user.id">
  <form name="add-comment-form" ng-submit="commentSubmit()">
    <div class="form-group">
      <label for="doc-comment-field">Sugiere otro conjunto:</label>
      <input ng-model="comment.text" id="doc-comment-field" type="text" class="form-control centered" placeholder="Sugiere otro conjunto" required />
    </div>
    <hr>
  </form>
</div>
