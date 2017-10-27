import { Me } from '../constants/me';

export function renameMe(name) {
  return(
    {
      type: Me.RENAME,
      name
    }
  );
}
