<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="query" uri="http://www.jahia.org/tags/queryLib" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="s" uri="http://www.jahia.org/tags/search" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<template:addResources type="css" resources="module.css"/>
<template:addResources type="javascript" resources="module.js"/>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
<script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<jcr:sql var="result"
         sql="SELECT * FROM [wemnt:tabConfig] AS tabConfig WHERE ISDESCENDANTNODE(tabConfig, '${renderContext.site.path}')"/>
<c:if test="${result.nodes != null && result.nodes.size > 0}">
    <div class="tab">
        <c:forEach var="node" items="${result.nodes}" varStatus="theCount">
            <button class="tablinks" id="tablink-${node.properties['jcr:uuid'].string}">${node.displayableName}</button>
            <script>
                $('#tablink-' + "${node.properties['jcr:uuid'].string}").on('click', function () {
                    $('[id^=widget-]').attr("style", "display: none"); //Hide the other tables
                    var tablinks = document.getElementsByClassName("tablinks");
                    for (i = 0; i < tablinks.length; i++) {
                        tablinks[i].className = tablinks[i].className.replace(" active", "");
                    }
                    document.getElementById("tablink-${node.properties['jcr:uuid'].string}").className += " active";
                    document.getElementById("widget-${node.properties['jcr:uuid'].string}").style.display = "block";
                });
            </script>
        </c:forEach>
    </div>
    <c:forEach var="node" items="${result.nodes}" varStatus="theCount">
        <jcr:nodeProperty node="${node}" name="jsonUrl" var="jsonUrl"/>
        <jcr:nodeProperty node="${node}" name="defaultTab" var="defaultTab"/>
        <jcr:nodeProperty node="${node}" name="tabType" var="tabType"/>
        <div id="widget-${node.properties['jcr:uuid'].string}" class="tabcontent">
            <c:if test="${not empty jsonUrl}">
                <table id="table-${node.properties['jcr:uuid'].string}" class="display compact"
                       style="width:100%;"></table>
                <script>
                    if ($.fn.DataTable.isDataTable("table-${node.properties['jcr:uuid'].string}")) { //Empty out previous table
                        $("table-${node.properties['jcr:uuid'].string}").DataTable().clear().destroy();
                        $("table-${node.properties['jcr:uuid'].string}").empty();
                    }
                    getPayload("${tabType}", "${node.properties['jcr:uuid'].string}", "${jsonUrl}");
                </script>
                <c:if test="${defaultTab eq 'true'}">
                    <script>
                        document.getElementById("tablink-${node.properties['jcr:uuid'].string}").className += " active";
                        document.getElementById("widget-${node.properties['jcr:uuid'].string}").style.display = "block";
                    </script>
                </c:if>
            </c:if>
            <c:if test="${empty jsonUrl}">
                <div>No JSON URL found</div>
            </c:if>
        </div>
    </c:forEach>
</c:if>
<c:if test="${result.nodes != null && result.nodes.size == 0}">
    <div class="warning-message">No activity widgets found</div>
</c:if>