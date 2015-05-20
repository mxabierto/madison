<div id="participate-comment-message" class="participate-vote-message message-box"></div>
@if(Auth::check())
    @if($doc->canUserEdit(Auth::user()))
      <div ng-init="caneditdocument=true"></div>
      <div id="participate-comment" class="participate-comment">
      	@include('doc.reader.cofemer.comment')
      </div>
    @endif
@endif
  <div id="participate-activity" class="participate-activity">
  	<h3>@{{ layoutTexts.header }}</h3>
    <p>@{{ layoutTexts.callToAction }}</p>
  	<div class="activity-thread">
      <div id="@{{ 'comment_' + comment.id }}" class="activity-item" ng-repeat="comment in comments | orderBy:activityOrder:true track by $id(comment)" ng-class="comment.label">
        <div comment-item activity-item-link="@{{ comment.link }}"></div>
      </div>
  	</div>
  </div>
