<?php

class AnnotationPermission extends Eloquent
{
    protected $table = "annotation_permissions";
    protected $softDelete = true;
    protected $fillable = ['annotation_id', 'user_id'];

    public function annotation()
    {
        return $this->belongsTo('DBAnnotation');
    }
}
