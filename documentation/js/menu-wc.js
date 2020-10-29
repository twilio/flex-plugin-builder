'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">flex-plugin-builder documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccountClient.html" data-type="entity-link">AccountClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssetClient.html" data-type="entity-link">AssetClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseClient.html" data-type="entity-link">BaseClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/BuildClient.html" data-type="entity-link">BuildClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigurationClient.html" data-type="entity-link">ConfigurationClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeploymentClient.html" data-type="entity-link">DeploymentClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentClient.html" data-type="entity-link">EnvironmentClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilesClient.html" data-type="entity-link">FilesClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/Http.html" data-type="entity-link">Http</a>
                            </li>
                            <li class="link">
                                <a href="classes/PluginsApiClient.html" data-type="entity-link">PluginsApiClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceClient.html" data-type="entity-link">ServiceClient</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Account.html" data-type="entity-link">Account</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Asset.html" data-type="entity-link">Asset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssetVersion.html" data-type="entity-link">AssetVersion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseClientOptions.html" data-type="entity-link">BaseClientOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Build.html" data-type="entity-link">Build</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BuildBundle.html" data-type="entity-link">BuildBundle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BuildData.html" data-type="entity-link">BuildData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Bundle.html" data-type="entity-link">Bundle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Configuration.html" data-type="entity-link">Configuration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Configurations.html" data-type="entity-link">Configurations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Deployment.html" data-type="entity-link">Deployment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeployResult.html" data-type="entity-link">DeployResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DisplayList.html" data-type="entity-link">DisplayList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Environment.html" data-type="entity-link">Environment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnvironmentResource.html" data-type="entity-link">EnvironmentResource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/File.html" data-type="entity-link">File</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FunctionVersion.html" data-type="entity-link">FunctionVersion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpConfig.html" data-type="entity-link">HttpConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Meta.html" data-type="entity-link">Meta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Options.html" data-type="entity-link">Options</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Package.html" data-type="entity-link">Package</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PackageDetail.html" data-type="entity-link">PackageDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Resource.html" data-type="entity-link">Resource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Runtime.html" data-type="entity-link">Runtime</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServerlessEntity.html" data-type="entity-link">ServerlessEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Service.html" data-type="entity-link">Service</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServiceResource.html" data-type="entity-link">ServiceResource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StartScript.html" data-type="entity-link">StartScript</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StartServerOptions.html" data-type="entity-link">StartServerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UIDependencies.html" data-type="entity-link">UIDependencies</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateConfigurationPayload.html" data-type="entity-link">UpdateConfigurationPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInputPlugin.html" data-type="entity-link">UserInputPlugin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Version.html" data-type="entity-link">Version</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});