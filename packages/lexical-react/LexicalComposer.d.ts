/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {Class} from 'utility-types';
import type {EditorThemeClasses, LexicalEditor, LexicalNode} from 'lexical';
type Props = {
  initialConfig?: {
    editor?: LexicalEditor | null;
    isReadOnly?: boolean;
    namespace?: string;
    nodes?: Array<Class<LexicalNode>>;
    theme?: EditorThemeClasses;
    onError?: (arg0: Error) => void;
  };
  children: React.ReactNode;
};
export default function LexicalComposer(arg0: Props): React.ReactNode;