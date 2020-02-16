import * as FormField from 'front-end/lib/components/form-field';
import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { ADT } from 'shared/lib/types';

export type Value = number | null;

export function parseValue(raw: string): Value {
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) { return null; }
  return parsed;
}

interface ChildState extends FormField.ChildStateBase<Value> {
  currency?: string;
  min?: number;
  max?: number;
}

type ChildParams = FormField.ChildParamsBase<Value> & Pick<ChildState, 'currency' | 'min' | 'max'>;

type InnerChildMsg
  = ADT<'onChange', Value>;

type ExtraChildProps = Pick<ChildState, 'currency'>;

type ChildComponent = FormField.ChildComponent<Value, ChildParams, ChildState, InnerChildMsg, ExtraChildProps>;

export type State = FormField.State<Value, ChildState>;

export type Params = FormField.Params<Value, ChildParams>;

export type Msg = FormField.Msg<InnerChildMsg>;

const childInit: ChildComponent['init'] = async params => params;

const childUpdate: ChildComponent['update'] = ({ state, msg }) => {
  switch (msg.tag) {
    case 'onChange':
      return [state.set('value', msg.value)];
    default:
      return [state];
  }
};

const ChildView: ChildComponent['view'] = props => {
  const { currency, state, dispatch, placeholder, className = '', validityClassName, disabled = false } = props;
  const input = (
    <input
      id={state.id}
      type='number'
      placeholder={placeholder}
      min={state.min}
      max={state.max}
      value={state.value === null ? undefined : state.value}
      className={`form-control ${className} ${validityClassName}`}
      onChange={e => {
        const value = parseValue(e.currentTarget.value);
        dispatch({ tag: 'onChange', value });
        // Let the parent form field component know that the value has been updated.
        props.onChange(value);
      }}
      disabled={disabled} />
  );
  if (!currency) { return input; }
  return (
    <InputGroup>
      <InputGroupAddon addonType='prepend'>
        <InputGroupText>{currency}</InputGroupText>
      </InputGroupAddon>
      {input}
    </InputGroup>
  );
};

export const component = FormField.makeComponent<Value, ChildParams, ChildState, InnerChildMsg, ExtraChildProps>({
  init: childInit,
  update: childUpdate,
  view: ChildView
});

export const init = component.init;

export const update = component.update;

export const view = component.view;

export default component;
