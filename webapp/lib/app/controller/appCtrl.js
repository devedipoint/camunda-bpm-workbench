/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var ServerSession = require('./../serverSession'),
    WsConnection = require('./../../util/wsConnection'),
    EventBus = require('./../../util/eventBus'),
    ProcessDebugger = require('../../debugger/processDebugger'),
    Workbench = require('./../workbench');


var Controller = ['$scope', '$location', function($scope, $location) {

  $scope.safeDigest = function(fn) {
  var phase = this.$root.$$phase;
    // only apply if not already in digest / apply
    if (phase !== '$apply' && phase !== '$digest') {
      this.$apply(fn);
    }
  };

  var serverUrl = "ws://localhost:9090/debug-session";

  // the global event bus
  var eventBus = new EventBus();

  // bootstrap the application services
  var connection = new WsConnection(serverUrl);
  var serverSession = new ServerSession(connection, eventBus);
  var workbench = new Workbench();

  if ($location.path() === '/debug') {
    workbench.perspective = 'debug';
  }

  $scope.$watch('workbench.perspective', function(newPerspective) {
    $location.path('/' + newPerspective);
  });

  workbench.eventBus = eventBus;

  // register the debugsession
  workbench.serverSession = serverSession;

  // register the update function
  workbench.update = function() {
    $scope.safeDigest();
  };

  // trigger scope whenever an event is fired. This listener is the first to register
  // and will always be invoked last.
  eventBus.on('*', function() {
    workbench.update();
  });

  var processDebugger = new ProcessDebugger(workbench);
  workbench.processDebugger = processDebugger;

  // expose the workbench
  $scope.workbench = workbench;

  // expose debugCommandId
  $scope.dbgCmdId = 0;

  // expose debug command results
  $scope.commandResults = [];

  // open the connection to the server
  connection.open();
}];

module.exports = Controller;

