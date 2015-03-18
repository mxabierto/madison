@extends('layouts/main')
@section('content')
@if(Auth::check())
<script>
  var user = {
    id: {{ Auth::user()->id }},
    email: '{{ Auth::user()->email }}',
    name: '{{ Auth::user()->fname . ' ' . substr(Auth::user()->lname, 0, 1) }}'
  };
</script>
@else
<script>
  var user = {
    id: '',
    email: '',
    name: ''
  }
</script>
@endif
<script>
  var doc = {{ $doc->toJSON() }};
  @if($showAnnotationThanks)
  $.showAnnotationThanks = true;
  @else
  $.showAnnotationThanks = false;
  @endif
</script>
<script src="/participa-assets/js/doc.js"></script>

<div class="modal fade" id="annotationThanks" tabindex="-1" role="dialog" aria-labelledby="annotationThanks" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
    </div>
  </div>
</div>
<div class="document-wrapper" ng-controller="DocumentPageController">
  <div class="container">

    <div class="row" ng-controller="ReaderController" ng-init="init({{ $doc->id }})">
      <div class="col-md-8">
        <div class="doc-head">
          <h1>{{ $doc->title }}</h1>
          <ul class="list-unstyled">
            <li>
              <small>@{{ 'POSTED' | translate }}: @{{ doc.created_at | date: 'longDate' }}, @{{ doc.created_at | date: 'HH:mm:ss' }}</small>
            </li>
            <li>
              <small>@{{ 'UPDATED' | translate }}: @{{ doc.updated_at | date: 'longDate' }}, @{{ doc.updated_at | date: 'HH:mm:ss' }}</small>
            </li>
          </ul>
          <div class="doc-extract" ng-if="introtext">
            <div class="markdown" data-ng-bind-html="introtext"></div>
          </div>
          <div>
              <p>
                  <strong>Te invitamos a 1) votar si los datos propuestos son de tu interés, y 2) proponer otros conjuntos de datos específicos que te gustaría encontrar en datos.gob.mx</strong>
              </p>
              <p>
                  Este ejercicio permanecerá abierto a comentarios y recomendaciones del 3 de marzo al 1 de abril de 2015. Los comentarios serán analizados por el Consejo Consultivo de Datos Abiertos, un órgano independiente de representación multisectorial, para definir cómo mejorar este documento rector de acuerdo a tu participación.
              </p>
              <p>
                  <strong>Participa, tu opinión ayudará a definir los siguientes pasos y procesos de la iniciativa de Datos Abiertos en México.  </strong>
              </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <ul class="nav nav-tabs" role="tablist" tourtip="@{{ step_messages.step_3 }}" tourtip-step="3" tourtip-next-label="Siguiente">
          <li ng-class="{'active':secondtab == false}"><a href="#tab-discussion" target="_self" role="tab" data-toggle="tab">Propuestas</a></li>
          <a href="{{ $doc->slug }}/feed" class="rss-link" target="_self"><img src="/participa-assets/img/rss-fade.png" class="rss-icon" alt="RSS Icon"></a>
        </ul>

        <div class="tab-content">
          <div id="tab-discussion" ng-class="{'active': secondtab == false}" class="tab-pane">
            <div class="doc-forum" ng-controller="CommentController" ng-init="init({{ $doc->id }}, false)">
              @include('doc.reader.votes.comments')
            </div>
          </div>
        </div>

      </div>
      <div class="col-md-4">
        <div class="doc-content-sidebar hide">
          <div class="sidebar-unit">
            <h4>{{ trans('messages.howtoparticipate'); }}</h4>
            <hr class="red">
            <ol>
              <li>{{ trans('messages.readpolicy') }}</li>
              <li>{{ trans('messages.signupnaddvoice') }}</li>
              <li>{{ trans('messages.anncommsuppopp') }}</li>
            </ol>
            <img src="/participa-assets/img/como-comentar.gif" class="how-to-annotate-img img-responsive" />
          </div>

          <div class="sidebar-unit" ng-controller="DocumentTocController" ng-show="headings.length > 0">
            <h4>{{ trans('messages.tableofcontents') }}</h4>
            <hr class="red">
            <div id="toc-container">
              <ul class="list-unstyled doc-headings-list">
                <li ng-repeat="heading in headings">
                  <a class="toc-heading toc-@{{ heading.tag | lowercase }}" href="#@{{ heading.link }}">@{{ heading.title }}</a>
                </li>
              </ul>
            </div>
          </div>



          <div class="sidebar-unit">
            <h4>{{ trans('messages.annotations') }}</h4>
            <hr class="red">
            <div ng-controller="AnnotationController" ng-init="init({{ $doc->id }})" class="rightbar participate">
              @include('doc.reader.annotations')
            </div>
          </div>

        </div>
      </div>
    </div>


  </div>
</div>
@endsection
