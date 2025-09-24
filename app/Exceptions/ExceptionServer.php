<?php

namespace App\Exceptions;

use Exception;

class ExceptionServer extends Exception
{
    private $claseerror;
    private $msgcliente;
    private $codigoerror;
    private $tituloerror;
    private $tipoerror;
    private $errorinterno;

    function __construct($claseerror, $msgcliente, $codigoerror, $tituloerror, $tipoerror = 'APPLOCAL', $errorinterno = 'Sin asignar') {
        $this->claseerror = $claseerror;
        $this->msgcliente = $msgcliente;
        $this->codigoerror = $codigoerror;
        $this->tituloerror = $tituloerror;
        $this->tipoerror = $tipoerror;
        $this->errorinterno = $errorinterno;

    }

    function getClaseerror() {
        return $this->claseerror;
    }

    function getErrorinterno() {
        return $this->errorinterno;
    }

    function getMsgcliente() {
        return $this->msgcliente;
    }

    function getCodigoerror() {
        return $this->codigoerror;
    }

    function getTituloerror() {
        return $this->tituloerror;
    }

    function getTipoerror() {
        return $this->tipoerror;
    }

    function setClaseerror($claseerror) {
        $this->claseerror = $claseerror;
    }

    function setMsgcliente($msgcliente) {
        $this->msgcliente = $msgcliente;
    }

    function setCodigoerror($codigoerror) {
        $this->codigoerror = $codigoerror;
    }

    function setTituloerror($tituloerror) {
        $this->tituloerror = $tituloerror;
    }

    function setTipoerror($tipoerror) {
        $this->tipoerror = $tipoerror;
    }

    function setErrorinterno($errorinterno) {
        $this->errorinterno = $errorinterno;
    }
}
