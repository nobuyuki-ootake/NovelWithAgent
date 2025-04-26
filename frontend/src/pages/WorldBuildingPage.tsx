import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import {
  WorldBuilding,
  Place,
  Culture,
  WorldBuildingFreeField,
  NovelProject,
} from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`worldbuilding-tabpanel-${index}`}
      aria-labelledby={`worldbuilding-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const WorldBuildingPage: React.FC = () => {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [worldBuilding, setWorldBuilding] = useState<WorldBuilding | null>(
    null
  );
  const [tabValue, setTabValue] = useState(0);
  const [mapImageUrl, setMapImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [history, setHistory] = useState<string>("");
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [freeFields, setFreeFields] = useState<WorldBuildingFreeField[]>([]);
  const [newFreeField, setNewFreeField] = useState<WorldBuildingFreeField>({
    id: "",
    title: "",
    content: "",
  });
  const [isEditingFreeField, setIsEditingFreeField] = useState<boolean>(false);
  const [currentFreeFieldId, setCurrentFreeFieldId] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newPlace, setNewPlace] = useState<Place>({
    id: "",
    name: "",
    description: "",
    significance: "",
  });
  const [isEditingPlace, setIsEditingPlace] = useState<boolean>(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<string>("");

  // 世界観情報を取得
  useEffect(() => {
    if (currentProject?.worldBuilding) {
      setWorldBuilding(currentProject.worldBuilding);
      setMapImageUrl(currentProject.worldBuilding.mapImageUrl || "");
      setDescription(currentProject.worldBuilding.setting || "");
      setHistory(currentProject.worldBuilding.history || "");
      setRules(currentProject.worldBuilding.rules || []);
      setPlaces(currentProject.worldBuilding.places || []);
      setCultures(currentProject.worldBuilding.cultures || []);
      setFreeFields(currentProject.worldBuilding.freeFields || []);
    }
  }, [currentProject]);

  // タブの切り替え
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "保存されていない変更があります。タブを切り替えると失われます。続けますか？"
        )
      ) {
        setTabValue(newValue);
      }
    } else {
      setTabValue(newValue);
    }
  };

  // マップ画像をアップロード
  const handleMapImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      setSnackbarMessage("画像サイズは5MB以下にしてください");
      setSnackbarOpen(true);
      return;
    }

    // 画像のプレビューURLを作成
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setMapImageUrl(result);
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  // 設定の変更
  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    setHasUnsavedChanges(true);
  };

  // 歴史の変更
  const handleHistoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHistory(e.target.value);
    setHasUnsavedChanges(true);
  };

  // ルールの追加
  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule("");
    setHasUnsavedChanges(true);
  };

  // ルールの削除
  const handleDeleteRule = (index: number) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
    setHasUnsavedChanges(true);
  };

  // 自由入力フィールドの変更
  const handleFreeFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFreeField({
      ...newFreeField,
      [name]: value,
    });
  };

  // 自由入力フィールドの追加
  const handleAddFreeField = () => {
    if (!newFreeField.title.trim()) return;

    if (isEditingFreeField) {
      // 既存のフィールドを更新
      const updatedFields = freeFields.map((field) =>
        field.id === currentFreeFieldId ? { ...newFreeField } : field
      );
      setFreeFields(updatedFields);
      setIsEditingFreeField(false);
      setCurrentFreeFieldId("");
    } else {
      // 新しいフィールドを追加
      const newField = {
        ...newFreeField,
        id: uuidv4(),
      };
      setFreeFields([...freeFields, newField]);
    }

    setNewFreeField({
      id: "",
      title: "",
      content: "",
    });
    setHasUnsavedChanges(true);
  };

  // 自由入力フィールドの編集
  const handleEditFreeField = (field: WorldBuildingFreeField) => {
    setNewFreeField({ ...field });
    setIsEditingFreeField(true);
    setCurrentFreeFieldId(field.id);
  };

  // 自由入力フィールドの削除
  const handleDeleteFreeField = (id: string) => {
    if (window.confirm("このフィールドを削除してもよろしいですか？")) {
      const updatedFields = freeFields.filter((field) => field.id !== id);
      setFreeFields(updatedFields);
      setHasUnsavedChanges(true);
    }
  };

  // 地名の変更ハンドラ
  const handlePlaceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPlace({
      ...newPlace,
      [name]: value,
    });
  };

  // 地名の追加
  const handleAddPlace = () => {
    if (!newPlace.name.trim()) return;

    let updatedPlaces: Place[] = [];

    if (isEditingPlace) {
      // 既存の地名を更新
      updatedPlaces = places.map((place) =>
        place.id === currentPlaceId ? { ...newPlace } : place
      );
    } else {
      // 新しい地名を追加
      const newPlaceItem = {
        ...newPlace,
        id: uuidv4(),
      };
      updatedPlaces = [...places, newPlaceItem];
    }

    // 状態を更新
    setPlaces(updatedPlaces);

    // worldBuilding状態も更新（特にこの部分が重要）
    if (worldBuilding) {
      const updatedWorldBuilding = {
        ...worldBuilding,
        places: updatedPlaces,
      };
      setWorldBuilding(updatedWorldBuilding);

      // ローカルストレージへの即時保存（オプション）
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          worldBuilding: updatedWorldBuilding,
          updatedAt: new Date(),
        };
        // ローカルストレージのプロジェクトも更新
        const projectsStr = localStorage.getItem("novelProjects");
        if (projectsStr) {
          try {
            const projects: NovelProject[] = JSON.parse(projectsStr);
            const updatedProjects = projects.map((p) =>
              p.id === currentProject.id ? updatedProject : p
            );
            localStorage.setItem(
              "novelProjects",
              JSON.stringify(updatedProjects)
            );
            console.log("地名の追加/編集がローカルストレージに保存されました");
          } catch (error) {
            console.error("地名保存中にエラーが発生しました:", error);
          }
        }
      }
    }

    setNewPlace({
      id: "",
      name: "",
      description: "",
      significance: "",
    });
    setIsEditingPlace(false);
    setCurrentPlaceId("");
    setHasUnsavedChanges(true);
  };

  // 地名の編集
  const handleEditPlace = (place: Place) => {
    setNewPlace({ ...place });
    setIsEditingPlace(true);
    setCurrentPlaceId(place.id);
  };

  // 地名の削除
  const handleDeletePlace = (id: string) => {
    if (window.confirm("この地名を削除してもよろしいですか？")) {
      const updatedPlaces = places.filter((place) => place.id !== id);
      setPlaces(updatedPlaces);

      // worldBuilding状態も更新
      if (worldBuilding) {
        const updatedWorldBuilding = {
          ...worldBuilding,
          places: updatedPlaces,
        };
        setWorldBuilding(updatedWorldBuilding);
      }

      setHasUnsavedChanges(true);
    }
  };

  // 変更を保存
  const handleSave = () => {
    if (!worldBuilding || !currentProject) return;

    console.log("保存前のplaces:", places);

    const updatedWorldBuilding: WorldBuilding = {
      ...worldBuilding,
      mapImageUrl,
      setting: description,
      history,
      rules,
      places,
      cultures,
      freeFields,
    };

    console.log("更新後のworldBuilding:", updatedWorldBuilding);

    setCurrentProject({
      ...currentProject,
      worldBuilding: updatedWorldBuilding,
      updatedAt: new Date(),
    });

    // ローカルストレージに保存（プロジェクトの永続化）
    const projectsStr = localStorage.getItem("novelProjects");
    if (projectsStr) {
      const projects: NovelProject[] = JSON.parse(projectsStr);
      const updatedProjects = projects.map((p) =>
        p.id === currentProject.id
          ? {
              ...currentProject,
              worldBuilding: updatedWorldBuilding,
              updatedAt: new Date(),
            }
          : p
      );
      localStorage.setItem("novelProjects", JSON.stringify(updatedProjects));
      console.log("プロジェクトをローカルストレージに保存しました");
    }

    setHasUnsavedChanges(false);
    setSnackbarMessage("世界観設定を保存しました");
    setSnackbarOpen(true);
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          世界観構築
        </Typography>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="world building tabs"
        >
          <Tab label="ワールドマップ" />
          <Tab label="世界観設定" />
          <Tab label="ルール" />
          <Tab label="地名" />
          <Tab label="自由入力" />
        </Tabs>

        {/* ワールドマップタブ */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              ワールドマップ
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                minHeight: 300,
                border: "1px dashed grey",
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
              }}
            >
              {mapImageUrl ? (
                <Box
                  component="img"
                  src={mapImageUrl}
                  alt="World Map"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "500px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <ImageIcon
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    世界のマップ画像をアップロードしてください
                  </Typography>
                </Box>
              )}
            </Box>

            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mt: 2 }}
            >
              マップ画像をアップロード
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleMapImageUpload}
              />
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              物語の舞台となる世界のマップを視覚化することで、世界観をより具体的に設計できます。
              <br />
              場所や領域、地形などを描いた画像をアップロードしてください。
            </Typography>
          </Box>
        </TabPanel>

        {/* 世界観設定タブ */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom>
              世界観
            </Typography>
            <TextField
              fullWidth
              label="世界観の概要"
              multiline
              rows={6}
              value={description}
              onChange={handleSettingChange}
              sx={{ mb: 3 }}
              placeholder="この物語の舞台となる世界について説明してください。例：テクノロジーのレベル、魔法の有無、政治体制など"
            />

            <Typography variant="h6" gutterBottom>
              歴史
            </Typography>
            <TextField
              fullWidth
              label="世界の歴史"
              multiline
              rows={6}
              value={history}
              onChange={handleHistoryChange}
              placeholder="この世界の歴史的背景や重要な出来事について説明してください。"
            />
          </Box>
        </TabPanel>

        {/* ルールタブ */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              世界のルール
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              この世界で適用される特殊なルールや法則を定義します（例：魔法の仕組み、科学の法則など）
            </Typography>

            <Box sx={{ display: "flex", mb: 2 }}>
              <TextField
                fullWidth
                label="新しいルール"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="例：「この世界では重力が地球の半分しかない」"
              />
              <Button
                variant="contained"
                onClick={handleAddRule}
                disabled={!newRule.trim()}
                sx={{ ml: 1 }}
              >
                追加
              </Button>
            </Box>

            <List>
              {rules.map((rule, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={rule} />
                </ListItem>
              ))}
              {rules.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                  ルールがありません。追加してください。
                </Typography>
              )}
            </List>
          </Box>
        </TabPanel>

        {/* 地名タブ */}
        <TabPanel value={tabValue} index={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              地名
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              物語の舞台となる重要な場所を追加しましょう
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <TextField
                  fullWidth
                  label="地名"
                  name="name"
                  value={newPlace.name}
                  onChange={handlePlaceChange}
                  placeholder="例：「エルフの森」「魔法学院」「古代遺跡」など"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="説明"
                  name="description"
                  value={newPlace.description}
                  onChange={handlePlaceChange}
                  multiline
                  rows={3}
                  placeholder="場所の詳細な説明を入力してください"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="物語における重要性"
                  name="significance"
                  value={newPlace.significance}
                  onChange={handlePlaceChange}
                  multiline
                  rows={2}
                  placeholder="この場所が物語においてどのような役割を果たすか説明してください"
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  startIcon={<LocationIcon />}
                  onClick={handleAddPlace}
                  disabled={!newPlace.name.trim()}
                >
                  {isEditingPlace ? "更新" : "追加"}
                </Button>
              </CardActions>
            </Card>

            {places.map((place) => (
              <Accordion key={place.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{place.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" gutterBottom>
                    説明
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                  >
                    {place.description || "説明はありません"}
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    重要性
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                  >
                    {place.significance || "重要性は定義されていません"}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditPlace(place)}
                      sx={{ mr: 1 }}
                    >
                      編集
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeletePlace(place.id)}
                    >
                      削除
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            {places.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                地名がありません。追加してください。
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* 自由入力タブ */}
        <TabPanel value={tabValue} index={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              自由入力フィールド
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              場所、文化、宗教、言語など、自由に項目を追加して世界観を豊かにしましょう
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <TextField
                  fullWidth
                  label="タイトル"
                  name="title"
                  value={newFreeField.title}
                  onChange={handleFreeFieldChange}
                  placeholder="例：「主要言語」「通貨システム」「交通手段」など"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="内容"
                  name="content"
                  value={newFreeField.content}
                  onChange={handleFreeFieldChange}
                  multiline
                  rows={4}
                  placeholder="詳細な説明を入力してください"
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleAddFreeField}
                  disabled={!newFreeField.title.trim()}
                >
                  {isEditingFreeField ? "更新" : "追加"}
                </Button>
              </CardActions>
            </Card>

            {freeFields.map((field) => (
              <Accordion key={field.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{field.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                  >
                    {field.content}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditFreeField(field)}
                      sx={{ mr: 1 }}
                    >
                      編集
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteFreeField(field.id)}
                    >
                      削除
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            {freeFields.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                自由入力フィールドがありません。追加してください。
              </Typography>
            )}
          </Box>
        </TabPanel>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
        >
          保存
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WorldBuildingPage;
