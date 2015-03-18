@if(Auth::check())
  <div id="participate-comment" class="participate-comment">
  	@include('doc.reader.votes.comment')
  </div>
  @else
  <div id="participate-comment" class="participate-comment">
  	<p>{{ trans('messages.please') }} <a href="{{ url('/participa/user/login', $parameters = array(), $secure = null) }}" target="_self">{{ trans('messages.login') }}</a> {{ trans('messages.tocomment') }}.</p>
  </div>
  @endif
  <div id="participate-activity" class="participate-activity">
  	<h3>Categorías de Datos Abiertos Propuestos</h3>
    <p>Vota por los conjuntos de datos que te interesan</p>
  	<div class="activity-thread">
      <div id="@{{ 'comment_' + comment.id }}" class="activity-item" ng-repeat="comment in comments | orderBy:activityOrder:true track by $id(comment)" ng-class="comment.label">
        <div comment-item activity-item-link="@{{ comment.link }}"></div>
      </div>
  	</div>
  </div>
