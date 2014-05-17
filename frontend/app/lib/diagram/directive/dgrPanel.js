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

var fs = require('fs'),
    DiagramManager = require('./../diagramManager');

var directiveTemplate = fs.readFileSync(__dirname + '/dgrPanel.html', { encoding: 'utf-8' });

var DiagramController = ['$scope', function($scope) {

  // initialize a new diagram manager
  $scope.diagramManager = new DiagramManager($scope.workbench);

}];

module.exports = function() {
  return {
    scope: {
      workbench : '='
    },
    controller: DiagramController,
    template: directiveTemplate
  };
};

