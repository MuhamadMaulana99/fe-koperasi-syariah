import DashboardConfig from './dashboard/DashboardConfig';
import AngsuranConfig from './koperasi/angsuran/AngsuranConfig';
import ApprovalConfig from './koperasi/approval/ApprovalConfig';
import PengajuanConfig from './koperasi/pengajuan/PengajuanConfig';
import PermohonanConfig from './koperasi/permohonan/PermohonanConfig';
import AnalisaConfig from './master/analisa/AnalisaConfig';
import NasabahConfig from './master/nasabah/NasabahConfig';
import StaffConfig from './master/staff/StaffConfig';
import SupllayerConfig from './supllayer/SupllayerConfig';
import UserRolesConfig from './userRoles/UserRolesConfig';

const appsConfigs = [
  SupllayerConfig,
  UserRolesConfig,
  AnalisaConfig,
  NasabahConfig,
  StaffConfig,
  AngsuranConfig,
  PengajuanConfig,
  PermohonanConfig,
  ApprovalConfig,
  DashboardConfig,
];

export default appsConfigs;
