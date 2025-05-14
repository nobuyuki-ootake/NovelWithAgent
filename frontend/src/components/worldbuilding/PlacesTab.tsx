import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardMedia,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import { useWorldBuildingContext } from "../../contexts/WorldBuildingContext";
import { v4 as uuidv4 } from "uuid";
import { PlaceElement } from "../../types";
// 場所タイプの定義
const PLACE_TYPES = [
  { value: "city", label: "都市" },
  { value: "town", label: "町" },
  { value: "village", label: "村" },
  { value: "castle", label: "城" },
  { value: "temple", label: "寺院" },
  { value: "forest", label: "森林" },
  { value: "mountain", label: "山脈" },
  { value: "lake", label: "湖" },
  { value: "river", label: "川" },
  { value: "ocean", label: "海" },
  { value: "island", label: "島" },
  { value: "desert", label: "砂漠" },
  { value: "cave", label: "洞窟" },
  { value: "ruin", label: "遺跡" },
  { value: "other", label: "その他" },
];

// 気候タイプの定義
const CLIMATE_TYPES = [
  { value: "tropical", label: "熱帯" },
  { value: "subtropical", label: "亜熱帯" },
  { value: "temperate", label: "温帯" },
  { value: "continental", label: "大陸性" },
  { value: "polar", label: "極地" },
  { value: "desert", label: "砂漠" },
  { value: "mediterranean", label: "地中海性" },
  { value: "oceanic", label: "海洋性" },
  { value: "monsoon", label: "モンスーン" },
  { value: "highland", label: "高地" },
  { value: "magical", label: "魔法的" },
  { value: "other", label: "その他" },
];

const PlacesTab: React.FC = () => {
  // コンテキストから必要な機能を取得
  const {
    getCurrentProjectState,
    updateProjectState,
    addPendingPlace,
    pendingPlaces,
    saveAllPendingElements,
    markTabAsUpdated,
    places = [],
  } = useWorldBuildingContext();

  // 状態管理
  const [currentPlace, setCurrentPlace] = useState<PlaceElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // プロジェクトから場所を読み込む
  useEffect(() => {
    const currentProject = getCurrentProjectState();
    if (currentProject?.worldBuilding?.places) {
      // 既存の場所を保持し、新しい場所を追加
      const existingPlaces = currentProject.worldBuilding
        .places as PlaceElement[];
      const updatedPlaces = [...existingPlaces];

      // ペンディング中の場所を追加（既存のものは上書き）
      pendingPlaces.forEach((pendingPlace) => {
        const existingIndex = updatedPlaces.findIndex(
          (p) => p.id === pendingPlace.id
        );
        if (existingIndex >= 0) {
          updatedPlaces[existingIndex] = pendingPlace as PlaceElement;
        } else {
          updatedPlaces.push(pendingPlace as PlaceElement);
        }
      });

      // 世界観データを更新
      updateProjectState((project) => ({
        ...project,
        worldBuilding: {
          ...project.worldBuilding,
          places: updatedPlaces,
        },
      }));
    }
  }, [pendingPlaces, getCurrentProjectState, updateProjectState]);

  // 新規場所作成ダイアログを開く
  const handleOpenNewDialog = () => {
    setCurrentPlace({
      id: uuidv4(),
      name: "",
      type: "place",
      originalType: "place",
      description: "",
      features: "",
      importance: "",
      relations: "",
      location: "",
      population: "",
      culturalFeatures: "",
      locationType: "other",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  // 場所編集ダイアログを開く
  const handleEdit = (place: PlaceElement) => {
    setCurrentPlace({ ...place });
    setIsEditing(true);
    setDialogOpen(true);
  };

  // 場所を削除
  const handleDelete = (id: string) => {
    const updatedPlaces = places.filter((place) => place.id !== id);
    setCurrentPlace(null);

    // 世界観データを更新
    updateProjectState((project) => ({
      ...project,
      worldBuilding: {
        ...project.worldBuilding,
        places: updatedPlaces,
      },
    }));

    // タブを更新済みとマーク
    markTabAsUpdated(3); // 場所タブのインデックス
  };

  // 地図ダイアログを開く
  const handleOpenMapDialog = (place: PlaceElement) => {
    setSelectedPlace(place);
    setMapCoordinates(place.coordinates || { x: 50, y: 50 });
    setMapDialogOpen(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentPlace(null);
  };

  // 地図ダイアログを閉じる
  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
    setSelectedPlace(null);
    setMapCoordinates(null);
  };

  // 地図上の座標を保存
  const handleSaveCoordinates = () => {
    if (!selectedPlace || !mapCoordinates) return;

    const updatedPlaces = places.map((place) =>
      place.id === selectedPlace.id
        ? { ...place, coordinates: mapCoordinates }
        : place
    );

    setCurrentPlace(null);

    // 世界観データを更新
    updateProjectState((project) => ({
      ...project,
      worldBuilding: {
        ...project.worldBuilding,
        places: updatedPlaces,
      },
    }));

    // タブを更新済みとマーク
    markTabAsUpdated(3); // 場所タブのインデックス

    // ダイアログを閉じる
    handleCloseMapDialog();
  };

  // 地図上のクリック位置を記録
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setMapCoordinates({ x, y });
  };

  // 場所の保存
  const handleSavePlace = () => {
    if (!currentPlace) return;

    // 場所を保存（編集または新規追加）
    if (isEditing) {
      const updatedPlaces = places.map((place) =>
        place.id === currentPlace.id ? currentPlace : place
      );
      setCurrentPlace(null);

      // 世界観データを更新
      updateProjectState((project) => ({
        ...project,
        worldBuilding: {
          ...project.worldBuilding,
          places: updatedPlaces,
        },
      }));
    } else {
      // 新しい場所を保存
      addPendingPlace(currentPlace);

      // すぐに保存
      saveAllPendingElements();
    }

    // タブを更新済みとマーク
    markTabAsUpdated(3); // 場所タブのインデックス

    // ダイアログを閉じる
    handleCloseDialog();
  };

  // 入力フィールドの変更を処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentPlace) return;

    setCurrentPlace({
      ...currentPlace,
      [e.target.name]: e.target.value,
    });
  };

  // セレクトフィールドの変更を処理
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    if (!currentPlace) return;

    setCurrentPlace({
      ...currentPlace,
      [e.target.name]: e.target.value,
    });
  };

  const placesList = Array.isArray(places) ? places : [];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">場所と地理</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewDialog}
        >
          新しい場所を追加
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        物語の舞台となる場所や地理的特徴を定義します。重要な都市、森林、山脈など、ストーリーに関わる場所について詳細を記述できます。
      </Typography>

      {placesList.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            まだ場所が追加されていません。「新しい場所を追加」ボタンから追加できます。
          </Typography>
        </Paper>
      ) : (
        <List sx={{ width: "100%" }}>
          {placesList.map((place: any, index: number) => (
            <Paper
              key={place.id || index}
              elevation={1}
              sx={{
                mb: 2,
                p: 2,
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(place.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
                sx={{ pt: 1 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {place.name || "名称未設定の場所"}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        <strong>種類:</strong> {place.locationType || "未指定"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                      >
                        {place.description || "説明がありません"}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* 場所編集/追加ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="place-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="place-dialog-title">
          {isEditing ? "場所を編集" : "新しい場所を追加"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                autoFocus
                fullWidth
                name="name"
                label="場所の名前"
                type="text"
                variant="outlined"
                value={currentPlace?.name || ""}
                onChange={handleInputChange}
              />
              <FormControl fullWidth>
                <InputLabel id="location-type-label">場所の種類</InputLabel>
                <Select
                  labelId="location-type-label"
                  id="locationType"
                  name="locationType"
                  value={currentPlace?.locationType || ""}
                  label="場所の種類"
                  onChange={handleSelectChange}
                >
                  {PLACE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <TextField
              name="description"
              label="場所の説明"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={currentPlace?.description || ""}
              onChange={handleInputChange}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="climate-label">気候（オプション）</InputLabel>
                <Select
                  labelId="climate-label"
                  id="climate"
                  name="climate"
                  value={currentPlace?.climate || ""}
                  label="気候（オプション）"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>未設定</em>
                  </MenuItem>
                  {CLIMATE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="population"
                label="人口（オプション）"
                type="text"
                fullWidth
                variant="outlined"
                value={currentPlace?.population || ""}
                onChange={handleInputChange}
              />
            </Stack>
            <TextField
              name="significance"
              label="重要性/役割（オプション）"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={currentPlace?.significance || ""}
              onChange={handleInputChange}
            />
            <TextField
              name="imageUrl"
              label="イメージURL（オプション）"
              type="text"
              fullWidth
              variant="outlined"
              value={currentPlace?.imageUrl || ""}
              onChange={handleInputChange}
              helperText="場所のイメージ画像のURLを指定できます"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleSavePlace}
            variant="contained"
            color="primary"
            disabled={!currentPlace?.name || !currentPlace?.description}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 地図ダイアログ */}
      <Dialog
        open={mapDialogOpen}
        onClose={handleCloseMapDialog}
        aria-labelledby="map-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="map-dialog-title">
          {selectedPlace?.name}の場所を地図上で指定
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            地図上でクリックして場所の位置を指定してください。
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 400,
              backgroundImage: "url('/assets/world-map-placeholder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#e0e0e0",
              border: "1px solid #ccc",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={handleMapClick}
          >
            {/* デフォルトのマップイメージがない場合のプレースホルダー */}
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#999",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <MapIcon /> 地図イメージを設定していません
            </Typography>

            {/* 選択された座標マーカー */}
            {mapCoordinates && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${mapCoordinates.x}%`,
                  top: `${mapCoordinates.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 0, 0, 0.7)",
                  border: "2px solid white",
                  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3)",
                }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            選択された座標: X: {mapCoordinates?.x || 0}%, Y:{" "}
            {mapCoordinates?.y || 0}%
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMapDialog}>キャンセル</Button>
          <Button
            onClick={handleSaveCoordinates}
            variant="contained"
            color="primary"
          >
            座標を保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacesTab;
